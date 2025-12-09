import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Props{
    title:string,
    description:string,
    icon:string
}
const features:Props[]=[
    {
        title:'Comprehensive Courses',
        description:'Access a wide range of courses ,crafted by industry experts',
        icon:'📚'
    },
    {
        title:'Interactive learning',
        description:'Engage with interactive content,quizzies and assignments to enhance your learning',
        icon:'👾'
    },
    {
        title:'Progress Tracking',
        description:'Monitor your achievements with detailed analytics and personalized dashboards',
        icon:'〰️'
    },
    {
        title:'Community Support',
        description:'Join a vibrant community of young leaders and people eager to improve everyday',
        icon:'📲'
    }
]
export default function Home() {
return (
    <>
    <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-10">
            <Badge className="px-5 py-3" variant='outline'>
                The Future of Education
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Elevate your Learning Experience</h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">Discover new way of learning with our modern management system.<br/>Access high quality courses anytime and anywhere</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href={'/courses'} className={buttonVariants({
                    size:'lg',
                })}>Explore Courses</Link>
                <Link href={'/login'} className={buttonVariants({
                    size:'lg',
                    variant:'outline'
                })}>
                Sign in
                </Link>
            </div>
        </div>
    </section>
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
            {
                features.map((feature,index)=>(
                    <Card key={index} className="hover:shadow-lg transition-shadow dark:bg-black">
                        <CardHeader>
                            <div className="text-4xl mb-4">
                            {feature?.icon}
                            </div>
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))
            }
    </section>
    </>
  );
}
