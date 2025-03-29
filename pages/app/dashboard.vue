<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ACCOUNT_ACCESS } from '~~/prisma/account-access-enum';

  definePageMeta({
    middleware: ['auth']
  });

  const accountStore = useAccountStore();
  const { activeMembership } = storeToRefs(accountStore);
  const notesStore = useNotesStore();
  const { notes } = storeToRefs(notesStore); // ensure the notes list is reactive
  const newNoteText = ref('');

  async function addNote() {
    await notesStore.createNote(newNoteText.value);
    newNoteText.value = '';
  }

  async function genNote() {
    const genNoteText = await notesStore.generateAINoteFromPrompt(
      newNoteText.value
    );
    newNoteText.value = genNoteText;
  }

  onMounted(async () => {
    await accountStore.init();
    await notesStore.fetchNotesForCurrentUser();
  });
</script>
<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-12 text-center mb-5">
        <h1 class="display-4 fw-bold">Notes Dashboard</h1>
      </div>
    </div>

    <div class="row justify-content-center" v-if="
      activeMembership &&
      (activeMembership.access === ACCOUNT_ACCESS.READ_WRITE ||
        activeMembership.access === ACCOUNT_ACCESS.ADMIN ||
        activeMembership.access === ACCOUNT_ACCESS.OWNER)
    ">
      <div class="col-md-8 mb-4">
        <div class="card shadow">
          <div class="card-body">
            <div class="form-group mb-3">
              <textarea
                v-model="newNoteText"
                class="form-control"
                rows="5"
                placeholder="Add a note..."></textarea>
            </div>
            <div class="d-flex justify-content-between">
              <button
                @click.prevent="addNote()"
                class="btn btn-primary">
                Add
              </button>
              <button
                v-if="activeMembership.account.features.includes('SPECIAL_FEATURE')"
                @click.prevent="genNote()"
                class="btn btn-purple">
                Generate
                <Icon name="mdi:magic" class="ms-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-md-8">
        <div v-if="notes.length === 0" class="text-center text-muted my-5">
          No notes yet. Add your first note above!
        </div>
        
        <div v-for="note in notes" :key="note.id" class="card mb-4 shadow">
          <div class="card-body">
            <p class="card-text">{{ note.note_text }}</p>
            <button
              @click.prevent="notesStore.deleteNote(note.id)"
              v-if="
                activeMembership &&
                (activeMembership.access === ACCOUNT_ACCESS.ADMIN ||
                  activeMembership.access === ACCOUNT_ACCESS.OWNER)
              "
              class="btn btn-danger btn-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-purple {
  background-color: #9b59b6;
  color: white;
}
.btn-purple:hover {
  background-color: #8e44ad;
  color: white;
}
</style>
