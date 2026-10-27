import { ToolPage } from "@/components/tool-page";
import { toolMetadata } from "@/lib/seo";
import { getTool } from "@/lib/tools";

const tool = getTool("pdf-compressor")!;
export const metadata = toolMetadata(tool);
export default function PdfCompressorPage() { return <ToolPage tool={tool} />; }
