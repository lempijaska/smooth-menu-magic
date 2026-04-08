import FloatingMenu from "@/components/FloatingMenu";
import Dock from "@/components/Dock";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Drag the menu around
        </h1>
        <p className="mt-3 text-muted-foreground">
          Click anywhere on the canvas to close it
        </p>
      </div>
      <FloatingMenu />
      <Dock />
    </div>
  );
};

export default Index;
