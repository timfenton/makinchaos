'use server'

import { insertMaterial, NewMaterial, updateMaterial } from "@/lib/db/schema/materials";

export const handleMaterialSubmit = async (data: NewMaterial) => {

    try{
      if(data.id) await updateMaterial(data.id, data);
      else await insertMaterial(data);
    } catch (e){
      const error = e as Error;
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };