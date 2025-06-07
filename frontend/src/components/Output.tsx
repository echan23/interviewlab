import { Button } from "@/components/ui/button";

const Output = ({ input }: { input: string }) => {
  const runCode = async () => {};

  return (
    <div className="output-container flex flex-col h-full">
      <div className="w-fit">
        <Button variant="outline" className="mb-2">
          Run
        </Button>
      </div>

      <div className="flex-1 bg-muted text-muted-foreground p-4 rounded-md font-mono text-sm whitespace-pre-wrap overflow-auto">
        <span className="font-semibold">Output</span>
        <br />
        <br />
        {input}
      </div>
    </div>
  );
};

export default Output;
