import feedbackData from "../data/feedbackData";
import FeedbackCard from "./FeedbackCard";

const FeedbackList = () => (
  <div className="pt-20 pb-8 px-4 sm:px-6 bg-zinc-900 min-h-screen">
    <div className="max-w-7xl mx-auto">
      <h2
        className="text-lg sm:text-xl md:text-2xl font-extrabold mb-6 sm:mb-8 text-blue-700 bg-zinc-800 border border-blue-200 rounded-xl shadow-sm px-4 sm:px-8 py-3 -tracking-tighter"
        style={{
          fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
          letterSpacing: "0.03em",
        }}
      >
        How's your experience in these college events?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {feedbackData.map((item) => (
          <FeedbackCard
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            question={item.question}
          />
        ))}
      </div>
    </div>
  </div>
);

export default FeedbackList;
