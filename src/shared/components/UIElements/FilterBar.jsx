import "./FiltersAndPagination.css";

export default function FilterBar({
  priceOrder,
  onPriceChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
}) {
  return (
    <div className="filter-bar">
      <select
        value={priceOrder}
        onChange={(e) => onPriceChange(e.target.value)}
      >
        <option value="">Sort by Price</option>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>

      <input
        type="text"
        placeholder={searchPlaceholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value.toLowerCase())}
      />
    </div>
  );
}
