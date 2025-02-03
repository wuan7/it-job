import { useState } from "react";
import { Button } from "./ui/button";

import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

type EditorValue = {
  body: string;
};

interface EditorProps {
  onSubmit: ({ body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: "create" | "update";
}

const Editor = ({
  onSubmit,
  onCancel,
  disabled = false,
  variant = "create",
}: EditorProps) => {
  const [text, setText] = useState("");




  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col ">
      <div
        className={cn(
          "flex flex-col border rounded-md overflow-hidden  transition ",
          disabled && "opacity-50"
        )}
      >
        <div className="flex p-2 ">
          <Input
            className="w-full !border-none !outline-none !ring-0 focus:!ring-0 focus:!outline-none focus:!border-none"
            onChange={(e) => setText(e.target.value)}
            placeholder="Soạn tin nhắn ..."
          />
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onSubmit({
                    body: "hello",
                  });
                }}
                disabled={disabled || isEmpty}
                className=" bg-[#007a5a] hover:bg-[#007a5a] text-white"
              >
                Save
              </Button>
            </div>
          )}

          {variant === "create" && (
            <Button
              disabled={disabled || isEmpty}
              onClick={() => {
                onSubmit({
                  body: "hello",
                });
              }}
              className={cn(
                "ml-auto",
                isEmpty
                  ? "bg-white hover:bg-white text-muted-foreground border border-slate-200"
                  : "bg-primaryBlue hover:bg-primaryBlue-light text-white"
              )}
            >
              <SendHorizontal className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
