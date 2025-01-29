'use server'

import { NewMaterialType, postMaterialType } from "@/lib/db/schema/materialTypes";

export const handleMaterialTypeSubmit = async (data: NewMaterialType) => {
    try{
      await postMaterialType(data as NewMaterialType);
    } catch (e){
      const error = e as Error;

      // eslint-disable-next-line no-console
      console.error(error);
    }

  };