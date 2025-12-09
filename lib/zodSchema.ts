import {z} from "zod";

export const CourseLevel=['Begineer','Intermediate','Pro'] as const 
export const CourseStatus=["Draft","Published","Archieved"] as const 
export const CategoryType=[
    'Development',
    'AI and ML',
    'Public Speaking',
    'Blockchain',
    'Devops & Cloud' as const
]
export const ZodSchema=z.object({
    title:z.string().min(4,{message:'Title must be atleast 4'}).max(200,{message:'Max 200 words!'}),
    description:z.string().min(5,{message:'Description must be atleast 5'}),
    fileKey:z.string().min(1,{message:'File is required'}),
    price:z.coerce.number().min(1,{message:'Price must be positive'}),
    duration:z.coerce.number().max(500).min(1,{message:'Min 1'}),
    level:z.enum(CourseLevel,{message:'Level required'}),
    category:z.enum(CategoryType,{message:'Category is required'}),
    // smallDescription:z.string().min(3,{message:'Min 3'}).max(100,{message:'Max 100'}),
    slug:z.string().min(3,{message:'Slug must be min 3'}),
    status:z.enum(CourseStatus,{message:'Status required!'})
})
export type ZodSchemaType = z.infer<typeof ZodSchema>;
