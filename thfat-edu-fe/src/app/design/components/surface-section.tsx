import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Demo, Section } from "./section-wrapper";

export function SurfaceSection() {
  return (
    <Section id="surfaces" title="Surfaces">
      <Demo label="Card">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Hóa hữu cơ</CardTitle>
              <CardDescription>Chương 3: Hiđrocacbon</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm text-neutral-600">120 câu hỏi · 4 đề thi thử</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" className="w-full">
                Luyện tập ngay
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-primary-200 bg-primary-50">
            <CardHeader>
              <Badge className="bg-primary-100 text-primary-700 border-primary-200 w-fit">
                Nổi bật
              </Badge>
              <CardTitle className="text-primary-900">Điện ly & Axit – Bazơ</CardTitle>
              <CardDescription>Kiến thức cốt lõi thi THPT</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm text-primary-700">280 câu hỏi · 8 đề thi thử</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" className="w-full">
                Luyện tập ngay
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Demo>

      <Demo label="Avatar">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>HS</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-primary-100 text-primary-700">NV</AvatarFallback>
          </Avatar>
          <Avatar className="size-8">
            <AvatarFallback className="text-caption bg-neutral-200 text-neutral-600">
              +5
            </AvatarFallback>
          </Avatar>
        </div>
      </Demo>

      <Demo label="Separator">
        <div className="space-y-4">
          <p className="text-body text-neutral-700">Nội dung phía trên</p>
          <Separator />
          <p className="text-body text-neutral-700">Nội dung phía dưới</p>
        </div>
      </Demo>

      <Demo label="Tabs">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="easy">Dễ</TabsTrigger>
            <TabsTrigger value="hard">Khó</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <p className="text-body pt-2 text-neutral-600">Hiển thị tất cả 280 câu hỏi.</p>
          </TabsContent>
          <TabsContent value="easy">
            <p className="text-body pt-2 text-neutral-600">Hiển thị 120 câu dễ.</p>
          </TabsContent>
          <TabsContent value="hard">
            <p className="text-body pt-2 text-neutral-600">Hiển thị 80 câu khó.</p>
          </TabsContent>
        </Tabs>
      </Demo>
    </Section>
  );
}
