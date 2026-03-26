import FloatingMenu from "@/components/FloatingMenu";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Floating Menu
        </h1>
        <p className="mt-3 text-muted-foreground">
          Click the <span className="text-primary">⋯</span> button to see the vortex animation
        </p>
      </div>
      <FloatingMenu />
    </div>
  );
};

export default Index;
