'use client'
import { EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { MenuBar } from './Menubar'
import TextAlign from '@tiptap/extension-text-align'
export function TipTapEditor({field}:{field:any}){
    const editor=useEditor({
        extensions:[
            StarterKit,
            TextAlign.configure({
                types:['heading','paragraph']
            })
        ],
        editorProps:{
            attributes:{
                class:'min-h-[300px] p-3 focus:outline-none '
            }
        },
        onUpdate:({editor})=>(
            field.onChange(JSON.stringify(editor.getJSON()))
        ),
        content: field.value
            ? (() => {
                try {
                    return JSON.parse(field.value) // if it's JSON
                } catch {
                    return field.value             // if it's HTML
                }
                })()
            : `<p>🧷</p>`,
        immediatelyRender:false
    })
    return (
        <div className='w-full border border-input rounded-lg overflow-hidden dark:bg-input/30'>
            <MenuBar editor={editor}/>
            <EditorContent editor={editor}/>
        </div>
    )
}