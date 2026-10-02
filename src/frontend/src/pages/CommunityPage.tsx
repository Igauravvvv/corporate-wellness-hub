import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnonymousLounge } from "./AnonymousLounge";
import { Users, HeartHandshake, Circle } from "lucide-react";

export function CommunityPage() {
  return (
    <div className="flex flex-col h-full bg-background relative max-w-7xl mx-auto">
      <div className="flex-none p-4 md:p-6 border-b border-border bg-card/50 backdrop-blur-sm z-10 sticky top-0">
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">Community</h1>
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4 h-11">
            <TabsTrigger value="live" className="text-xs font-medium h-9">Live</TabsTrigger>
            <TabsTrigger value="groups" className="text-xs font-medium h-9">Groups</TabsTrigger>
            <TabsTrigger value="circles" className="text-xs font-medium h-9">Circles</TabsTrigger>
            <TabsTrigger value="help" className="text-xs font-medium h-9">Help</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-0 border-none outline-none">
            {/* The Lounge itself will take up the remaining height in its own container or we structure it to fill */}
          </TabsContent>
          <TabsContent value="groups" className="p-4 mt-4">
            <div className="text-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-xl">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <h3 className="font-semibold text-lg text-foreground mb-1">Your Groups</h3>
              <p className="text-sm max-w-sm mx-auto mb-4">Long-lived interest communities to join and explore.</p>
              <Button>Browse Groups</Button>
            </div>
          </TabsContent>
          <TabsContent value="circles" className="p-4 mt-4">
            <div className="text-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-xl">
              <Circle className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <h3 className="font-semibold text-lg text-foreground mb-1">Peer Circles</h3>
              <p className="text-sm max-w-sm mx-auto mb-4">Small groups focused on specific support topics.</p>
              <Button>Find a Circle</Button>
            </div>
          </TabsContent>
          <TabsContent value="help" className="p-4 mt-4">
            <div className="text-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-xl">
              <HeartHandshake className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <h3 className="font-semibold text-lg text-foreground mb-1">Help Exchange</h3>
              <p className="text-sm max-w-sm mx-auto mb-4">Ask for help or offer your skills to colleagues.</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline">I Need Help</Button>
                <Button>I Can Help</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0">
          <AnonymousLounge />
        </div>
      </div>
    </div>
  );
}
