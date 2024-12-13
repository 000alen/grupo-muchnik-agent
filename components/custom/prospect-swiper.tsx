"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Check, X, ArrowLeftCircle, ArrowRightCircle, Loader2 } from "lucide-react";
import { Prospect } from "@/db/app-schema";
import { trpc } from "@/lib/trpc-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProspectSwiper({ prospects }: { prospects: Prospect[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [keyPressed, setKeyPressed] = useState<"left" | "right" | null>(null);
  const [reviewedCount, setReviewedCount] = useState(0);
  const router = useRouter();

  const currentProspect = prospects[currentIndex];
  const totalProspects = prospects.length;
  const isLastProspect = currentIndex === totalProspects - 1;

  const handleSwipe = useCallback((swipeDirection: "left" | "right") => {
    if (!currentProspect) return;
    
    setDirection(swipeDirection);
    setReviewedCount(prev => prev + 1);
    
    // Add your logic here for what happens when a prospect is approved/rejected
    if (swipeDirection === "right") {
      toast.success("Prospect approved!");
    } else {
      toast.error("Prospect rejected!");
    }

    // Move to next prospect or finish if it's the last one
    setTimeout(() => {
      if (isLastProspect) {
        setCurrentIndex(totalProspects); // This will make currentProspect null
      } else {
        setCurrentIndex(prev => prev + 1);
      }
      setDirection(null);
    }, 300);
  }, [currentProspect, isLastProspect, totalProspects]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentProspect) return;
      
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const direction = e.key === "ArrowLeft" ? "left" : "right";
        setKeyPressed(direction);
        handleSwipe(direction);
      } else if (e.key === " ") {
        e.preventDefault();
        setKeyPressed("right");
        handleSwipe("right");
      }
    };

    const handleKeyUp = () => {
      setKeyPressed(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [currentProspect, handleSwipe]); // Added handleSwipe to dependencies

  // Effect for handling redirection when there are no more prospects
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!currentProspect && prospects.length > 0) {
      timer = setTimeout(() => {
        router.push("/dashboard/prospects");
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentProspect, prospects.length, router]);

  if (prospects.length === 0) {
    return (
      <div className="h-[calc(100vh-12rem)] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-6">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Building className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xl">No prospects found</h3>
              <p className="text-muted-foreground">There are no prospects to review at the moment.</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/prospects")}
            >
              Return to Prospects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentProspect) {
    return (
      <div className="h-[calc(100vh-12rem)] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-6">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xl">All caught up!</h3>
              <p className="text-muted-foreground">
                You've reviewed all {reviewedCount} {reviewedCount === 1 ? 'prospect' : 'prospects'}.
              </p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 mt-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                Returning to prospects page...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-12rem)] flex items-center justify-center">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 text-muted-foreground/50">
        <ArrowLeftCircle className={`h-8 w-8 ${keyPressed === "left" ? "text-destructive" : ""}`} />
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 text-muted-foreground/50">
        <ArrowRightCircle className={`h-8 w-8 ${keyPressed === "right" ? "text-green-600" : ""}`} />
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div className="text-center mb-2 text-sm text-muted-foreground">
          {currentIndex + 1} of {totalProspects}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProspect.id}
            initial={{ 
              scale: 0.8,
              opacity: 0,
              y: 0,
              x: 0
            }}
            animate={{ 
              scale: 1,
              opacity: 1,
              y: 0,
              x: direction === "left" ? -300 : direction === "right" ? 300 : 0
            }}
            exit={{ 
              scale: 0.8,
              opacity: 0,
              y: 0
            }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{currentProspect.companyName}</h3>
                    {currentProspect.companyIndustry && (
                      <p className="text-sm text-muted-foreground">
                        {currentProspect.companyIndustry}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {currentProspect.companyAction && (
                  <p className="text-muted-foreground">{currentProspect.companyAction}</p>
                )}
              </CardContent>
              <CardFooter className="justify-between">
                <Button
                  variant="destructive"
                  size="icon"
                  className={`rounded-full h-12 w-12 transition-transform ${
                    keyPressed === "left" ? "scale-110" : ""
                  }`}
                  onClick={() => handleSwipe("left")}
                >
                  <X className="h-6 w-6" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className={`rounded-full h-12 w-12 bg-green-600 hover:bg-green-700 transition-transform ${
                    keyPressed === "right" ? "scale-110" : ""
                  }`}
                  onClick={() => handleSwipe("right")}
                >
                  <Check className="h-6 w-6" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 right-0 text-center text-sm text-muted-foreground py-4">
        Use ← → arrow keys or spacebar to navigate
      </div>
    </div>
  );
}