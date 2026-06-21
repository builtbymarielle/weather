/**
 * SortableLocationItem
 * This component represents a single location item in the recent locations list
 * that can be dragged to reorder. It uses the useSortable hook from dnd-kit to
 * handle the drag-and-drop functionality. It renders a LocationCard inside a button,
 * and the entire card is draggable. The onDelete function is passed down to the
 * LocationCard, and we stop the click event from propagating when the delete icon
 * is clicked to prevent selecting the card when trying to delete.
 */
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import LocationCard from "./LocationCard";

function SortableLocationItem({
  loc,
  selected,
  onSelectLocation,
  onDeleteLocation,
  tempUnit,
  clockTick,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: loc.city,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} className="nav-item mb-2">
      <button
        className="p-0 m-0 w-100 text-left border-0 rounded bg-transparent"
        onClick={() => onSelectLocation(loc)}
        {...attributes}
        {...listeners}
        style={{ cursor: "grab" }}
      >
        <LocationCard
          {...loc}
          selected={selected}
          tempUnit={tempUnit}
          clockTick={clockTick}
          onDelete={(city) => onDeleteLocation(loc)}
        />
      </button>
    </li>
  );
}

export default SortableLocationItem;
