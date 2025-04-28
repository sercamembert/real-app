import { db } from "@/lib/prismadb";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";

interface CommentSectionProps {
  postId: string;
}

const CommentSection = async ({ postId }: CommentSectionProps) => {
  const comments = await db?.comment.findMany({
    where: {
      postId,
    },
    include: {
      author: true,
      replies: {
        include: {
          author: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="w-full mt-6">
      <CreateComment postId={postId} />

      <div className="w-full flex flex-col gap-y-6 mt-4">
        {comments ? (
          comments
            .filter((comment) => !comment.replyToId)
            .map((topLevelComment) => {
              return (
                <div key={topLevelComment.id} className="flex flex-col">
                  <div className="mb-2">
                    <PostComment postId={postId} comment={topLevelComment} />
                  </div>

                  {topLevelComment.replies.map((reply) => {
                    return (
                      <div
                        key={reply.id}
                        className="ml-2 py-2 pl-4 border-l-2 border-zinc-200"
                      >
                        <PostComment comment={reply} postId={postId} />
                      </div>
                    );
                  })}
                </div>
              );
            })
        ) : (
          <div>Comments not available</div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
