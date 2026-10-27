import { ToolPage } from "@/components/tool-page";
import { toolMetadata } from "@/lib/seo";
import { getTool } from "@/lib/tools";

const tool = getTool("webp-to-png")!;
export const metadata = toolMetadata(tool);
export default function WebpToPngPage() { return <ToolPage tool={tool} />; }
