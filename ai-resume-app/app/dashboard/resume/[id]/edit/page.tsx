import { ResumeInfoProvider } from "@/context/ResumeInfoConext";
import FormSection from "@/components/custom/FormSection";
import ResumePreview from "@/components/custom/ResumePriview";
import Header from "@/components/custom/Header";

export default async function Edit({
  params,
}: {
  params: { id: string };
}) {
  const resumeId = params.id;

  return (
    <ResumeInfoProvider>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        <FormSection resumeId={resumeId} />
        <ResumePreview />
      </div>
    </ResumeInfoProvider>
  );
}
