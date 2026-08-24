import cardData from "../data/cardData";
import CardComponent from "../components/CardComponent";

const CardList = () => (
  <div className="pb-8 px-4 sm:px-6 bg-zinc-900">
    <div className="max-w-7xl mx-auto">
      <h2
        className="text-lg mt-6 sm:text-xl md:text-2xl font-extrabold mb-6 sm:mb-8 text-blue-700 bg-zinc-800 border border-blue-200 rounded-xl shadow-sm px-4 sm:px-8 py-3 -tracking-tighter"
        style={{
          fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
          letterSpacing: "0.03em",
        }}
      >
        How's your experience with your college representatives?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {cardData.map((item) => (
          <CardComponent
            key={item.id}
            cardId={item.id}
            image={item.image}
            name={item.name}
            designation={item.designation}
          />
        ))}
      </div>
    </div>
  </div>
);

export default CardList;
