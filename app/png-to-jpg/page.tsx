import { ToolPage } from "@/components/tool-page";
import { toolMetadata } from "@/lib/seo";
import { getTool } from "@/lib/tools";

const tool = getTool("png-to-jpg")!;
export const metadata = toolMetadata(tool);
export default function PngToJpgPage() { return <ToolPage tool={tool} />; }
