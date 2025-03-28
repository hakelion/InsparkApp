import { supabase } from '../utils/supabase';

export namespace SupabaseDataService {
  // Generic CRUD operations for any table
  export async function getAll(table: string) {
    const { data, error } = await supabase
      .from(table)
      .select('*');
    
    if (error) throw error;
    return data;
  }

  export async function getById(table: string, id: number) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  export async function create(table: string, data: any) {
    const { data: insertedData, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return insertedData;
  }

  export async function update(table: string, id: number, data: any) {
    const { data: updatedData, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return updatedData;
  }

  export async function remove(table: string, id: number) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Specialized queries
  export async function query(table: string, queryFn: (query: any) => any) {
    // This allows for custom query building
    let query = supabase.from(table).select('*');
    query = queryFn(query); // Apply custom filters, joins, etc.
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }

  // RPC calls for stored procedures
  export async function callFunction(functionName: string, params: any) {
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) throw error;
    return data;
  }
} 