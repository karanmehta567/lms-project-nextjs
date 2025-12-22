'use client'
import { useState, ReactNode } from 'react'
import {
    DndContext,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    rectIntersection,
    DragEndEvent,
    DraggableSyntheticListeners,
} from '@dnd-kit/core'
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Link from 'next/link'
import { toast } from 'sonner'
import {
    ChevronDown,
    ChevronRight,
    FileText,
    GripVertical,
    Trash2Icon,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { AdminCorseType } from '@/app/data/user/one-course'
import { ReorderCourseStructurePrisma } from '@/lib/edit'
import NewChapterModel from './NewChapterModel'
import NewLessonModel from './NewLessonModel'
import { DeleteLesson } from './DeleteLesson'
import { DeleteChapter } from './DeleteChapter'

/* -------------------- TYPES -------------------- */

interface Props {
  data: AdminCorseType
}

interface SortableProps {
  id: string
  data: {
    type: 'chapter' | 'lesson'
    chapterId?: string
  }
  children: (listeners: DraggableSyntheticListeners) => ReactNode
  className?: string
}

/* -------------------- SORTABLE WRAPPER -------------------- */

function SortableItem({ id, data, children, className }: SortableProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn('touch-none', className, isDragging && 'z-10')}
    >
      {children(listeners)}
    </div>
  )
}

/* -------------------- MAIN COMPONENT -------------------- */

export default function CourseStructure({ data }: Props) {
    const [items, setItems] = useState(
        data.chapter?.map(ch => ({
        id: ch.id,
        title: ch.title,
        order: ch.position,
        isOpen: true,
        lessons: ch.lessons.map(ls => ({
            id: ls.id,
            title: ls.title,
            order: ls.position,
        })),
        })) ?? []
    )

    /* -------------------- DRAG LOGIC -------------------- */

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const activeType = active.data.current?.type
        const overType = over.data.current?.type

        /* ---------- CHAPTER REORDER ---------- */
        if (activeType === 'chapter' && overType === 'chapter') {
        const oldIndex = items.findIndex(c => c.id === active.id)
        const newIndex = items.findIndex(c => c.id === over.id)
        if (oldIndex === -1 || newIndex === -1) return

        const reordered = arrayMove(items, oldIndex, newIndex).map(
            (chapter, index) => ({
            ...chapter,
            order: index + 1,
            })
        )

        setItems(reordered)

        const res = await ReorderCourseStructurePrisma({
            type: 'chapter',
            courseId: data.id,
            items: reordered.map(ch => ({
            id: ch.id,
            order: ch.order,
            })),
        })

        if (res.status === 'error') {
            toast.error(res.message)
        }

        return
        }

        /* ---------- LESSON REORDER ---------- */
        if (activeType === 'lesson' && overType === 'lesson') {
        const activeChapterId = active.data.current?.chapterId
        const overChapterId = over.data.current?.chapterId

        if (activeChapterId !== overChapterId) {
            toast.error('Lessons can only be reordered within the same chapter')
            return
        }

        const chapterIndex = items.findIndex(c => c.id === activeChapterId)
        if (chapterIndex === -1) return

        const chapter = items[chapterIndex]

        const oldIndex = chapter.lessons.findIndex(l => l.id === active.id)
        const newIndex = chapter.lessons.findIndex(l => l.id === over.id)
        if (oldIndex === -1 || newIndex === -1) return

        const reorderedLessons = arrayMove(
            chapter.lessons,
            oldIndex,
            newIndex
        ).map((lesson, index) => ({
            ...lesson,
            order: index + 1,
        }))

        const updatedItems = [...items]
        updatedItems[chapterIndex] = {
            ...chapter,
            lessons: reorderedLessons,
        }

        setItems(updatedItems)

        const res = await ReorderCourseStructurePrisma({
            type: 'lesson',
            chapterId: chapter.id,
            items: reorderedLessons.map(ls => ({
            id: ls.id,
            order: ls.order,
            })),
        })

        if (res.status === 'error') {
            toast.error(res.message)
        }

        return
        }

        toast.error('Invalid drag operation')
    }

  function toggleChapter(id: string) {
        setItems(prev =>
        prev.map(ch =>
            ch.id === id ? { ...ch, isOpen: !ch.isOpen } : ch
        )
        )
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
        })
  )

  /* -------------------- UI -------------------- */

  return (
        <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragEnd={handleDragEnd}
        //   measuring={{
        //     droppable: { strategy: 'Always' },
        //   }}
        >
        <Card className='mx-5'>
            <CardHeader className='flex flex-row items-center justify-between border-b border-border'>
            <CardTitle>Chapters</CardTitle>
            <NewChapterModel courseId={data.id}/>
            </CardHeader>
            <CardContent>
            <SortableContext
                items={items.map(i => i.id)}
                strategy={verticalListSortingStrategy}
            >
                {items.map(chapter => (
                <SortableItem
                    key={chapter.id}
                    id={chapter.id}
                    data={{ type: 'chapter' }}
                >
                    {listeners => (
                    <Card className="mb-3">
                        <Collapsible
                        open={chapter.isOpen}
                        onOpenChange={() => toggleChapter(chapter.id)}
                        >
                        <div className="flex items-center justify-between p-2 border-b">
                            <div className="flex items-center gap-2">
                            <Button size="icon" variant="ghost" {...listeners}>
                                <GripVertical className="size-4" />
                            </Button>

                            <CollapsibleTrigger asChild>
                                <Button size="icon" variant="ghost">
                                {chapter.isOpen ? (
                                    <ChevronDown className="size-4" />
                                ) : (
                                    <ChevronRight className="size-4" />
                                )}
                                </Button>
                            </CollapsibleTrigger>

                            <span className="font-medium">
                                {chapter.title}
                            </span>
                            </div>

                            <DeleteChapter chapterId={chapter.id} courseId={data.id}/>
                        </div>

                        <CollapsibleContent>
                            <SortableContext
                            items={chapter.lessons.map(l => l.id)}
                            strategy={verticalListSortingStrategy}
                            >
                            {chapter.lessons.map(lesson => (
                                <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{
                                    type: 'lesson',
                                    chapterId: chapter.id,
                                }}
                                >
                                {lessonListeners => (
                                    <div className="flex items-center justify-between p-2 hover:bg-accent rounded">
                                    <div className="flex items-center gap-2">
                                        <Button
                                        size="icon"
                                        variant="ghost"
                                        {...lessonListeners}
                                        >
                                        <GripVertical className="size-4" />
                                        </Button>
                                        <FileText className="size-4" />
                                        <Link
                                        href={`/dashboard/courses/${data.id}/${chapter.id}/${lesson.id}`}
                                        >
                                        {lesson.title}
                                        </Link>
                                    </div>
                                    <DeleteLesson chapterId={chapter.id} courseId={data.id} lessonId={lesson.id}/>
                                    </div>
                                )}
                                </SortableItem>
                            ))}
                            </SortableContext>
                            <div className='p-2'>
                                <NewLessonModel chapterId={chapter.id} courseId={data.id} />
                            </div>
                        </CollapsibleContent>
                        </Collapsible>
                    </Card>
                    )}
                </SortableItem>
                ))}
            </SortableContext>
            </CardContent>
        </Card>
        </DndContext>
    )
}
