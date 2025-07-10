import { notFound } from "next/navigation";
import { connectToDB } from "@/lib/mongodb";
import UserResume from "@/models/UserResume";
import { ResumeInfoProvider } from "@/context/ResumeInfoConext";
import FormSection from "@/components/custom/FormSection";
import ResumePreview from "@/components/custom/ResumePriview";
import Header from "@/components/custom/Header";

export default async function EditPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params?.id; // ✅ safe usage
  await connectToDB();

  const resume = await UserResume.findById(id);

  if (!resume) {
    notFound(); // ✅ correct 404 behavior
  }

  return (
    <ResumeInfoProvider>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        <FormSection resumeId={resume._id.toString()} />
        <ResumePreview />
      </div>
    </ResumeInfoProvider>
  );
}