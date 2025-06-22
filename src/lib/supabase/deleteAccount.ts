"use server"

import { createClient } from "./serverAdmin"

const deleteAccount = async(id: string) => {
    const supabase = createClient();
    (await supabase).auth.admin.deleteUser(id)
}

export {deleteAccount}