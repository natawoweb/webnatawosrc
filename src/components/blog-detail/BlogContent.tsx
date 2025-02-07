
interface BlogContentProps {
  content: string;
}

export const BlogContent = ({ content }: BlogContentProps) => {
  return (
    <div className="mt-8" dangerouslySetInnerHTML={{ __html: content }} />
  );
};
