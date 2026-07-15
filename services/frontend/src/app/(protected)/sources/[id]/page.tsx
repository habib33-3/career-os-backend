import SourceDetails from "@/features/sources/components/SourceDetails";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const SourceDetailsPage = async ({ params }: Props) => {
  const { id } = await params;

  return <SourceDetails id={id} />;
};

export default SourceDetailsPage;
