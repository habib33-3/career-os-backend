"use client";

import { useState } from "react";

import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import UpdateSourceForm from "./UpdateSourceForm";

const UpdateSourceDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="mr-2 size-4" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Source</DialogTitle>

          <DialogDescription>Update source details</DialogDescription>
        </DialogHeader>

        <UpdateSourceForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSourceDialog;
