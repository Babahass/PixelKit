import { ToolPage } from "@/components/tool-page";
import { toolMetadata } from "@/lib/seo";
import { getTool } from "@/lib/tools";

const tool = getTool("image-compressor")!;
export const metadata = toolMetadata(tool);
export default function ImageCompressorPage() { return <ToolPage tool={tool} />; }
