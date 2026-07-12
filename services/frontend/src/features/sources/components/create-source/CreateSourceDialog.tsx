"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CreateSourceForm from "./CreateSourceForm";

const CreateSourceDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>Create Source</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Source</DialogTitle>

          <DialogDescription>
            Add a new source to your collection.
          </DialogDescription>
        </DialogHeader>

        <CreateSourceForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateSourceDialog;
