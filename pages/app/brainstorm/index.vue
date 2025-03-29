<template>
    <div class="neural-brainstorm-app" :class="{ 'dark-mode': darkMode }">
      <header>
        <div class="logo-container">
          <h1>{{ appTitle }}</h1>
          <button @click="toggleDarkMode" class="theme-toggle">
            {{ darkMode ? '☀️' : '🌙' }}
          </button>
        </div>
        <div class="project-controls">
          <input v-model="projectName" placeholder="Project Name" class="project-name-input">
          <button @click="saveProject" class="save-btn">Save Project</button>
        </div>
      </header>
  
      <main>
        <div class="building-levels">
          <div 
            v-for="level in buildingLevels" 
            :key="level.id" 
            class="level-tab"
            :class="{ active: currentLevel === level.id }"
            @click="setCurrentLevel(level.id)">
            {{ level.name }}
          </div>
        </div>
  
        <div class="workspace">
          <!-- Foundation Level -->
          <div v-if="currentLevel === 'foundation'" class="level-container foundation-level">
            <h2>Foundation Level - Core Story Elements</h2>
            <div class="foundation-blocks">
              <div class="foundation-block premise-block">
                <h3>Story Premise</h3>
                <textarea v-model="storyElements.premise" placeholder="What is your story about? Define the central conflict or concept."></textarea>
                <button @click="getAISuggestion('premise')" class="ai-btn">Get AI Suggestions</button>
              </div>
              
              <div class="foundation-block characters-block">
                <h3>Core Characters</h3>
                <div v-for="(character, index) in storyElements.characters" :key="index" class="character-entry">
                  <input v-model="character.name" placeholder="Character Name">
                  <textarea v-model="character.description" placeholder="Brief character description"></textarea>
                  <button @click="removeCharacter(index)" class="remove-btn">Remove</button>
                </div>
                <button @click="addCharacter" class="add-btn">Add Character</button>
                <button @click="getAISuggestion('characters')" class="ai-btn">Get AI Suggestions</button>
              </div>
              
              <div class="foundation-block setting-block">
                <h3>Main Setting</h3>
                <textarea v-model="storyElements.setting" placeholder="Where and when does your story take place?"></textarea>
                <button @click="getAISuggestion('setting')" class="ai-btn">Get AI Suggestions</button>
              </div>
              
              <div class="foundation-block theme-block">
                <h3>Central Theme</h3>
                <textarea v-model="storyElements.theme" placeholder="What big idea or message does your story explore?"></textarea>
                <button @click="getAISuggestion('theme')" class="ai-btn">Get AI Suggestions</button>
              </div>
            </div>
          </div>
  
          <!-- Framework Level -->
          <div v-if="currentLevel === 'framework'" class="level-container framework-level">
            <h2>Framework Level - Story Structure</h2>
            <div class="structure-selector">
              <h3>Story Structure</h3>
              <select v-model="storyElements.structure">
                <option value="three-act">Three-Act Structure</option>
                <option value="hero-journey">Hero's Journey</option>
                <option value="save-the-cat">Save the Cat</option>
                <option value="seven-point">Seven-Point System</option>
                <option value="custom">Custom</option>
              </select>
            </div>
  
            <div class="structure-blocks">
              <div v-if="storyElements.structure === 'three-act'" class="structure-block">
                <div class="act-block">
                  <h4>Act 1: Setup</h4>
                  <textarea v-model="storyElements.acts.act1" placeholder="Introduce main characters, setting, and the initial conflict"></textarea>
                </div>
                <div class="act-block">
                  <h4>Act 2: Confrontation</h4>
                  <textarea v-model="storyElements.acts.act2" placeholder="Develop conflicts, raise stakes, explore obstacles"></textarea>
                </div>
                <div class="act-block">
                  <h4>Act 3: Resolution</h4>
                  <textarea v-model="storyElements.acts.act3" placeholder="Climax and resolution of conflicts"></textarea>
                </div>
                <button @click="getAISuggestion('structure')" class="ai-btn wide-btn">Get AI Structure Suggestions</button>
              </div>
  
              <!-- Other structure types would be conditionally rendered here -->
            </div>
  
            <div class="character-arcs">
              <h3>Character Arcs</h3>
              <div v-for="(character, index) in storyElements.characters" :key="index" class="character-arc">
                <h4>{{ character.name }}</h4>
                <div class="arc-points">
                  <div class="arc-point">
                    <label>Starting Point</label>
                    <textarea v-model="character.arc.start" placeholder="Where does this character begin emotionally/mentally?"></textarea>
                  </div>
                  <div class="arc-connector"></div>
                  <div class="arc-point">
                    <label>Midpoint</label>
                    <textarea v-model="character.arc.mid" placeholder="How does this character change midway?"></textarea>
                  </div>
                  <div class="arc-connector"></div>
                  <div class="arc-point">
                    <label>Ending Point</label>
                    <textarea v-model="character.arc.end" placeholder="Where does this character end up emotionally/mentally?"></textarea>
                  </div>
                </div>
                <button @click="getAISuggestion('characterArc', index)" class="ai-btn">Get Arc Suggestions</button>
              </div>
            </div>
          </div>
  
          <!-- Room Level -->
          <div v-if="currentLevel === 'rooms'" class="level-container rooms-level">
            <h2>Room Level - Scenes & Details</h2>
            <div class="scene-builder">
              <h3>Scene Builder</h3>
              <button @click="addScene" class="add-btn">Add New Scene</button>
              
              <div class="scenes-container">
                <div v-for="(scene, index) in storyElements.scenes" :key="index" class="scene-block">
                  <div class="scene-header">
                    <input v-model="scene.title" placeholder="Scene Title">
                    <select v-model="scene.act">
                      <option value="act1">Act 1</option>
                      <option value="act2">Act 2</option>
                      <option value="act3">Act 3</option>
                    </select>
                    <button @click="removeScene(index)" class="remove-btn">×</button>
                  </div>
                  <textarea v-model="scene.content" placeholder="Scene description, goals, and key moments"></textarea>
                  <div class="scene-details">
                    <div class="scene-element">
                      <label>Characters Present</label>
                      <select v-model="scene.characters" multiple>
                        <option v-for="(character, charIndex) in storyElements.characters" :key="charIndex" :value="character.name">
                          {{ character.name }}
                        </option>
                      </select>
                    </div>
                    <div class="scene-element">
                      <label>Setting</label>
                      <input v-model="scene.setting" placeholder="Location">
                    </div>
                    <div class="scene-element">
                      <label>Goal</label>
                      <input v-model="scene.goal" placeholder="Scene purpose">
                    </div>
                  </div>
                  <button @click="getAISuggestion('scene', index)" class="ai-btn">Get Scene Suggestions</button>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Finishing Level -->
          <div v-if="currentLevel === 'finishing'" class="level-container finishing-level">
            <h2>Finishing Level - Polish & Refinement</h2>
            
            <div class="finishing-tools">
              <div class="finishing-tool">
                <h3>Dialogue Polish</h3>
                <select v-model="selectedScene" class="scene-selector">
                  <option value="">Select a scene to polish dialogue</option>
                  <option v-for="(scene, index) in storyElements.scenes" :key="index" :value="index">
                    {{ scene.title }}
                  </option>
                </select>
                
                <div v-if="selectedScene !== ''" class="dialogue-editor">
                  <h4>{{ storyElements.scenes[selectedScene].title }}</h4>
                  <textarea v-model="storyElements.scenes[selectedScene].dialogue" placeholder="Enter dialogue to polish"></textarea>
                  <button @click="getAISuggestion('dialogue', selectedScene)" class="ai-btn">Polish Dialogue</button>
                </div>
              </div>
              
              <div class="finishing-tool">
                <h3>Emotional Impact Analysis</h3>
                <p>Analyze how your story will emotionally impact readers</p>
                <button @click="getAISuggestion('emotionalImpact')" class="ai-btn wide-btn">Analyze Emotional Impact</button>
                <div v-if="aiAnalysis.emotionalImpact" class="analysis-result">
                  {{ aiAnalysis.emotionalImpact }}
                </div>
              </div>
              
              <div class="finishing-tool">
                <h3>Theme Reinforcement</h3>
                <p>Check how effectively your theme is reinforced throughout the story</p>
                <button @click="getAISuggestion('themeReinforcement')" class="ai-btn wide-btn">Analyze Theme Integration</button>
                <div v-if="aiAnalysis.themeReinforcement" class="analysis-result">
                  {{ aiAnalysis.themeReinforcement }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  
      <!-- AI Suggestions Modal -->
      <div v-if="showSuggestionModal" class="suggestion-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>AI Suggestions</h3>
            <button @click="showSuggestionModal = false" class="close-btn">×</button>
          </div>
          <div class="modal-body">
            <div v-if="isLoadingSuggestions" class="loading-spinner">
              <div class="spinner"></div>
              <p>Generating suggestions...</p>
            </div>
            <div v-else class="suggestions">
              <div v-for="(suggestion, index) in currentSuggestions" :key="index" class="suggestion">
                <p>{{ suggestion }}</p>
                <button @click="applySuggestion(suggestion)" class="apply-btn">Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NeuralBrainstormApp',
    data() {
      return {
        appTitle: 'NeuralStory Canvas',
        darkMode: true,
        projectName: 'My Sci-Fi Story',
        currentLevel: 'foundation',
        selectedScene: '',
        buildingLevels: [
          { id: 'foundation', name: 'Foundation' },
          { id: 'framework', name: 'Framework' },
          { id: 'rooms', name: 'Rooms' },
          { id: 'finishing', name: 'Finishing' }
        ],
        storyElements: {
          premise: '',
          characters: [
            { 
              name: '', 
              description: '',
              arc: { start: '', mid: '', end: '' }
            }
          ],
          setting: '',
          theme: '',
          structure: 'three-act',
          acts: {
            act1: '',
            act2: '',
            act3: ''
          },
          scenes: []
        },
        aiAnalysis: {
          emotionalImpact: '',
          themeReinforcement: ''
        },
        showSuggestionModal: false,
        isLoadingSuggestions: false,
        currentSuggestions: [],
        currentSuggestionTarget: {
          type: '',
          index: null
        },
        apiKey: process.env.VUE_APP_AWANLLM_API_KEY || ''
      }
    },
    methods: {
      toggleDarkMode() {
        this.darkMode = !this.darkMode
      },
      setCurrentLevel(levelId) {
        this.currentLevel = levelId
      },
      addCharacter() {
        this.storyElements.characters.push({
          name: '',
          description: '',
          arc: { start: '', mid: '', end: '' }
        })
      },
      removeCharacter(index) {
        this.storyElements.characters.splice(index, 1)
      },
      addScene() {
        this.storyElements.scenes.push({
          title: `Scene ${this.storyElements.scenes.length + 1}`,
          act: 'act1',
          content: '',
          characters: [],
          setting: '',
          goal: '',
          dialogue: ''
        })
      },
      removeScene(index) {
        this.storyElements.scenes.splice(index, 1)
      },
      saveProject() {
        // Create project object
        const project = {
          name: this.projectName,
          timestamp: new Date().toISOString(),
          elements: this.storyElements
        }
        
        // In a real app, you might save to an API or localStorage
        localStorage.setItem('neural-story-project', JSON.stringify(project))
        
        // Provide feedback
        alert('Project saved successfully!')
      },
      async getAISuggestion(type, index = null) {
        this.isLoadingSuggestions = true
        this.showSuggestionModal = true
        this.currentSuggestionTarget = { type, index }
        
        // Prepare the prompt based on suggestion type
        let prompt = ''
        
        switch(type) {
          case 'premise':
            prompt = `Generate 3 creative story premise suggestions for a sci-fi thriller. Make them detailed and intriguing.`
            break
          case 'characters':
            prompt = `Create 3 interesting character concepts for a sci-fi thriller, with brief descriptions of their backgrounds and motivations.`
            break
          case 'setting':
            prompt = `Suggest 3 unique sci-fi settings for a thriller story, with details about the environment and atmosphere.`
            break
          case 'theme':
            prompt = `Propose 3 thought-provoking themes that could be explored in a sci-fi thriller narrative.`
            break
          case 'structure':
            prompt = `Based on a three-act structure, suggest how a sci-fi thriller could be organized. Provide brief descriptions for each act.`
            break
          case 'characterArc':
            const character = this.storyElements.characters[index]
            prompt = `Create a character arc for "${character.name || 'a character'}" in a sci-fi thriller, showing their starting point, mid-story change, and endpoint.`
            break
          case 'scene':
            const scene = this.storyElements.scenes[index]
            prompt = `Generate ideas for a scene titled "${scene.title}" in a sci-fi thriller, including key actions, dialogue concepts, and emotional beats.`
            break
          case 'dialogue':
            const dialogueScene = this.storyElements.scenes[index]
            prompt = `Polish and improve this dialogue for the scene "${dialogueScene.title}": ${dialogueScene.dialogue || '[No dialogue provided]'}`
            break
          case 'emotionalImpact':
            prompt = `Analyze how this story concept might emotionally impact readers: Premise: ${this.storyElements.premise}. Theme: ${this.storyElements.theme}`
            break
          case 'themeReinforcement':
            prompt = `Suggest ways to reinforce this theme throughout a story: ${this.storyElements.theme}`
            break
        }
        
        try {
          // Call the AI API with the prepared prompt
          const suggestions = await this.callAI(prompt)
          this.currentSuggestions = this.formatSuggestions(suggestions)
        } catch (error) {
          console.error('Error getting AI suggestions:', error)
          this.currentSuggestions = ['Error: Could not generate suggestions. Please try again.']
        } finally {
          this.isLoadingSuggestions = false
        }
      },
      async callAI(prompt) {
        // This converts your Python code to JavaScript for API call
        const url = "https://api.awanllm.com/v1/chat/completions"
        
        const payload = {
          model: "MODEL_NAME",
          messages: [
            { role: "system", content: "You are a helpful assistant specialized in creative writing and story development for science fiction thrillers." },
            { role: "user", content: prompt }
          ],
          repetition_penalty: 1.1,
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40,
          max_tokens: 1024,
          stream: false // Changed to false for simplicity
        }
        
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
        
        // For demonstration, return sample data instead of making actual API call
        // In a real app, you would use:
        // const response = await fetch(url, {
        //   method: 'POST',
        //   headers: headers,
        //   body: JSON.stringify(payload)
        // })
        // const data = await response.json()
        // return data.choices[0].message.content
        
        return new Promise(resolve => {
          setTimeout(() => {
            // Sample responses based on prompt type
            if (prompt.includes('premise')) {
              resolve(`1. In 2157, a rare artifact called "The Millennium" is discovered, capable of providing glimpses into the future. As global powers fight for control, a reluctant STAR (superhuman) must protect it while uncovering a conspiracy that threatens reality itself.
  
  2. The Arcadian Border Force captures a Frysian physicist who claims to have built a device that predicts impending catastrophes. As Britannia's government attempts to weaponize her invention, a disgraced STAR operative must determine if she's telling the truth before the device's most terrible prediction comes true.
  
  3. A Frysian resistance fighter discovers "The Millennium," an ancient alien artifact that shows visions of alternate timelines. As Britannia's forces close in, the fighter and a renegade STAR must navigate possible futures to find the one path that leads to Frysia's freedom.`)
            } else if (prompt.includes('character')) {
              resolve(`1. Elara Voss - A brilliant Frysian scientist who discovered how to harness the power of The Millennium. Haunted by visions of future catastrophes, she struggles with the moral weight of her knowledge while trying to keep her discoveries from Britannia's military.
  
  2. Commander Dryden Shaw - A loyal Britannian STAR operative whose enhanced abilities have made him the perfect soldier. When he begins experiencing glitches in his perception of time after exposure to The Millennium, he questions everything he was trained to believe.
  
  3. Kaira Reymond - A third-generation Frysian resistance leader with a photographic memory. She has witnessed Britannian atrocities since childhood and seeks to use The Millennium to gain tactical advantage, but doesn't realize how the artifact is subtly altering her mind.`)
            } else {
              resolve(`Sample AI response for: ${prompt}`)
            }
          }, 1500) // Simulate API delay
        })
      },
      formatSuggestions(response) {
        // Simple formatting - split on numbered list items
        // In a real app, you'd want more sophisticated parsing
        return response.split(/\d\./).filter(item => item.trim().length > 0)
      },
      applySuggestion(suggestion) {
        const { type, index } = this.currentSuggestionTarget
        
        switch(type) {
          case 'premise':
            this.storyElements.premise = suggestion
            break
          case 'characters':
            // Extract name from suggestion (assuming format: "Name - Description")
            const nameMatch = suggestion.match(/^([^-]+)/)
            const name = nameMatch ? nameMatch[1].trim() : 'Character'
            
            // Create new character from suggestion
            this.storyElements.characters.push({
              name: name,
              description: suggestion,
              arc: { start: '', mid: '', end: '' }
            })
            break
          case 'setting':
            this.storyElements.setting = suggestion
            break
          case 'theme':
            this.storyElements.theme = suggestion
            break
          case 'structure':
            // Simplified - in real app would parse more intelligently
            this.storyElements.acts.act1 = suggestion
            break
          case 'characterArc':
            // Simple parsing approach - in real app would be more sophisticated
            const arcParts = suggestion.split(/starting point|midpoint|endpoint/i);
            if (arcParts.length >= 3) {
              this.storyElements.characters[index].arc.start = arcParts[1].trim()
              this.storyElements.characters[index].arc.mid = arcParts[2].trim()
              this.storyElements.characters[index].arc.end = arcParts[3]?.trim() || ''
            } else {
              this.storyElements.characters[index].arc.start = suggestion
            }
            break
          case 'scene':
            this.storyElements.scenes[index].content = suggestion
            break
          case 'dialogue':
            this.storyElements.scenes[index].dialogue = suggestion
            break
          case 'emotionalImpact':
            this.aiAnalysis.emotionalImpact = suggestion
            break
          case 'themeReinforcement':
            this.aiAnalysis.themeReinforcement = suggestion
            break
        }
        
        this.showSuggestionModal = false
      }
    },
    mounted() {
      // Load saved project if exists
      const savedProject = localStorage.getItem('neural-story-project')
      if (savedProject) {
        const project = JSON.parse(savedProject)
        this.projectName = project.name
        this.storyElements = project.elements
      }
      
      // Pre-fill with Al Millennium information
      if (!savedProject) {
        this.storyElements.premise = "Al Millennium is a sci-fi thriller about a special artifact which can see glimpses of the future. The story follows superpowered humans called STARs in a world where Britannia has colonized Arcadia and exploits neighboring Frysia."
        this.storyElements.theme = "The ethics of power and seeing the future; the struggle against colonialism and exploitation"
        this.storyElements.setting = "A futuristic world where Britannia is a colonial power that exploits Frysia and its people, treating them as second-class citizens"
      }
    }
  }
  </script>
  
  <style scoped>
  .neural-brainstorm-app {
    min-height: 100vh;
    background-color: #f5f5f5;
    color: #333;
    font-family: 'Inter', 'Roboto', sans-serif;
  }
  
  .neural-brainstorm-app.dark-mode {
    background-color: #121212;
    color: #e0e0e0;
  }
  
  header {
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .dark-mode header {
    background-color: #1e1e1e;
    border-bottom: 1px solid #333;
  }
  
  .logo-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .logo-container h1 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }
  
  .theme-toggle {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
  }
  
  .project-controls {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .project-name-input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .dark-mode .project-name-input {
    background-color: #333;
    border-color: #444;
    color: #e0e0e0;
  }
  
  .save-btn {
    padding: 0.5rem 1rem;
    background-color: #8a2be2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }
  
  .save-btn:hover {
    background-color: #7a1bd2;
  }
  
  main {
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }
  
  .building-levels {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    background-color: #fff;
    padding: 0.5rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .dark-mode .building-levels {
    background-color: #1e1e1e;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .level-tab {
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    border-radius: 4px;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .level-tab.active {
    background-color: #8a2be2;
    color: white;
  }
  
  .level-tab:not(.active):hover {
    background-color: #f0f0f0;
  }
  
  .dark-mode .level-tab:not(.active):hover {
    background-color: #2a2a2a;
  }
  
  .workspace {
    flex: 1;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    overflow-y: auto;
    max-height: calc(100vh - 11rem);
  }
  
  .dark-mode .workspace {
    background-color: #1e1e1e;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
  
  .level-container {
    animation: fadeIn 0.3s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #8a2be2;
  }
  
  .dark-mode h2 {
    color: #b06aff;
  }
  
  h3 {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
  }
  
  /* Foundation Level Styles */
  .foundation-blocks {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .foundation-block {
    background-color: #f9f9f9;
    border-radius: 6px;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .dark-mode .foundation-block {
    background-color: #2a2a2a;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  
  textarea, input {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
    resize: vertical;
  }
  
  .dark-mode textarea, .dark-mode input {
    background-color: #333;
    border-color: #444;
    color: #e0e0e0;
  }
  
  textarea {
    min-height: 120px;
  }
  
  .character-entry {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
  }
  
  .dark-mode .character-entry {
    border-bottom-color: #333;
  }
  
  .add-btn, .remove-btn, .ai-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }
  
  .add-btn {
    background-color: #4caf50;
    color: white;
  }
  
  .add-btn:hover {
    background-color: #43a047;
  }
  
  .remove-btn {
    background-color: #f44336;
    color: white;
  }
  
  .remove-btn:hover {
    background-color: #e53935;
  }
  
  .ai-btn {
    background-color: #ff69b4;
    color: white;
    margin-top: 0.5rem;
  }
  
  .ai-btn:hover {
    background-color: #ff5ba7;
  }
  
  .wide-btn {
    width: 100%;
  }
  
  /* Framework Level Styles */
  .structure-selector {
    margin-bottom: 2rem;
  }
  
  .structure-selector select {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    margin-top: 0.5rem;
  }
  
  .dark-mode .structure-selector select {
    background-color: #333;
    border-color: #444;
    color: #e0e0e0;
  }
  
  .structure-blocks {
    margin-bottom: 2rem;
  }
  
  .structure-block {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .act-block {
    background-color: #f9f9f9;
    border-radius: 6px;
    padding: 1rem;
  }
  
  .dark-mode .act-block {
    background-color: #2a2a2a;
  }
  
  .character-arcs {
    margin-top: 2rem;
  }
  
  .character-arc {
    margin-bottom: 2rem;
    background-color: #f9f9f9;
    border-radius: 6px;
    padding: 1rem;
  }
  
  .dark-mode .character-arc {
    background-color: #2a2a2a;
  }
  
  .arc-points {
    display: flex;
    align-items: center;
    margin: 1rem 0;
  }
  
  .arc-point {
    flex: 1;
  }
  
  .arc-connector {
    height: 2px;
    background-color: #8a2be2;
    flex-grow: 0.5;
    margin: 0 0.5rem;
  }
  
  .dark-mode .arc-connector {
    background-color: #b06aff;
  }
  
  /* Room Level Styles */
  .scenes-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }
  
  .scene-block {
    background-color: #f9f9f9;
    border-radius: 6px;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .dark-mode .scene-block {
    background-color: #2a2a2a;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  
  .scene-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .scene-header input {
    margin-bottom: 0;
  }
  
  .scene-header select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .dark-mode .scene-header select {
    background-color: #333;
    border-color: #444;
    color: #e0e0e0;
  }
  
  .scene-header .remove-btn {
    padding: 0.25rem 0.5rem;
    font-size: 1.2rem;
  }
  
  .scene-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .scene-element {
    margin-bottom: 0.5rem;
  }
  
  .scene-element label {
    display: block;
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
    font-weight: 500;
  }
  
  .scene-element input, .scene-element select {
    padding: 0.5rem;
    margin-bottom: 0;
  }
  
  /* Finishing Level Styles */
  .finishing-tools {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .finishing-tool {
    background-color: #f9f9f9;
    border-radius: 6px;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .dark-mode .finishing-tool {
    background-color: #2a2a2a;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  
  .scene-selector {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .dark-mode .scene-selector {
    background-color: #333;
    border-color: #444;
    color: #e0e0e0;
  }
  
  .dialogue-editor {
    margin-top: 1rem;
  }
  
  .analysis-result {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #f0f0f0;
    border-radius: 4px;
    white-space: pre-line;
  }
  
  .dark-mode .analysis-result {
    background-color: #333;
  }
  
  /* Modal Styles */
  .suggestion-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
  
  .dark-mode .modal-content {
    background-color: #1e1e1e;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }
  
  .modal-header {
    padding: 1rem;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .dark-mode .modal-header {
    border-bottom-color: #333;
  }
  
  .modal-header h3 {
    margin: 0;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #888;
  }
  
  .dark-mode .close-btn {
    color: #aaa;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #8a2be2;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .suggestion {
    background-color: #f9f9f9;
    border-radius: 6px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .dark-mode .suggestion {
    background-color: #2a2a2a;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  
  .apply-btn {
    padding: 0.5rem 1rem;
    background-color: #8a2be2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    margin-top: 0.5rem;
  }
  
  .apply-btn:hover {
    background-color: #7a1bd2;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .foundation-blocks,
    .structure-block,
    .scenes-container,
    .finishing-tools {
      grid-template-columns: 1fr;
    }
    
    .arc-points {
      flex-direction: column;
      align-items: stretch;
    }
    
    .arc-connector {
      width: 2px;
      height: 20px;
      margin: 0.5rem auto;
    }
    
    .scene-details {
      grid-template-columns: 1fr;
    }
  }
  </style>