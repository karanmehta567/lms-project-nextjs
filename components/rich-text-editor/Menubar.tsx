import { type Editor } from "@tiptap/react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Toggle } from "../ui/toggle";
import { AlignCenter, AlignLeft, AlignRight, BoldIcon, Heading1Icon, Heading2Icon, Heading3Icon, ItalicIcon, ListIcon } from "lucide-react";
import { cn } from "@/lib/utils";
interface IAppProps{
    editor:Editor| null
}
export function MenuBar({editor}:IAppProps){
    if(!editor){
        return null;
    }
    return (
        <div className="border border-input rounded-lg p-2 bg-card flex flex-wrap gap-1 items-center">
            <TooltipProvider>
                <div className="flex gap-1 flex-wrap">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle size='sm' pressed={editor.isActive("bold")} onPressedChange={()=>editor.chain().focus().toggleBold().run()}
                                className={cn(
                                    editor.isActive("bold") && 'text-muted-foreground bg-muted'
                                )}>
                                <BoldIcon/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bold</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle size='sm' pressed={editor.isActive("italic")} onPressedChange={()=>editor.chain().focus().toggleItalic().run()}
                                className={cn(
                                    editor.isActive("italic") && 'text-muted-foreground bg-muted'
                                )}>
                                <ItalicIcon/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Italic</TooltipContent>
                    </Tooltip>
                        <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle size='sm' pressed={editor.isActive("heading",{level:1})} onPressedChange={()=>editor.chain().focus().toggleHeading({level:1}).run()}
                                className={cn(
                                    editor.isActive("heading",{level:1}) && 'text-muted-foreground bg-muted'
                                )}>
                                <Heading1Icon/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 1</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle size='sm' pressed={editor.isActive("heading",{level:2})} onPressedChange={()=>editor.chain().focus().toggleHeading({level:2}).run()}
                                className={cn(
                                    editor.isActive("heading",{level:2}) && 'text-muted-foreground bg-muted'
                                )}>
                                <Heading2Icon/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 2</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle size='sm' pressed={editor.isActive("heading",{level:3})} onPressedChange={()=>editor.chain().focus().toggleHeading({level:3}).run()}
                                className={cn(
                                    editor.isActive("heading",{level:3}) && 'text-muted-foreground bg-muted'
                                )}>
                                <Heading3Icon/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 3</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle size='sm' pressed={editor.isActive("bulletList")} onPressedChange={()=>editor.chain().focus().toggleBulletList().run()}
                                className={cn(
                                    editor.isActive(editor.isActive("bulletList")) && 'text-muted-foreground bg-muted'
                                )}>
                                <ListIcon/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>
                </div>
                <div className="flex items-center mx-2 h-6">
    {/* vertical divider */}
        <div className="w-px h-full bg-border mx-2 dark:bg-white" />

    {/* alignment buttons */}
        <div className="flex items-center gap-1"> 
            <Tooltip>
                <TooltipTrigger asChild>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: "left" })}
                    onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
                    className={cn(
                        "flex items-center justify-center",
                        editor.isActive({ textAlign: "left" }) && "text-muted-foreground bg-muted"
                    )}
                >
                    <AlignLeft />
                </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align Left</TooltipContent>
        </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: "center" })}
                        onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
                        className={cn(
                            "flex items-center justify-center",
                            editor.isActive({ textAlign: "center" }) && "text-muted-foreground bg-muted"
                        )}
                    >
                        <AlignCenter />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent>Align Center</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: "right" })}
                        onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
                        className={cn(
                            "flex items-center justify-center",
                            editor.isActive({ textAlign: "right" }) && "text-muted-foreground bg-muted"
                        )}
                    >
                        <AlignRight />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent>Align Right</TooltipContent>
            </Tooltip>

        </div>
    </div>
            </TooltipProvider>
        </div>
    )
}