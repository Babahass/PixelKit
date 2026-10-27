import { ToolPage } from "@/components/tool-page";
import { toolMetadata } from "@/lib/seo";
import { getTool } from "@/lib/tools";

const tool = getTool("word-to-pdf")!;
export const metadata = toolMetadata(tool);
export default function WordToPdfPage() { return <ToolPage tool={tool} />; }
