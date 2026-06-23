/**
 * SortableLocationItem
 * This component represents a single location item in the recent locations list
 * that can be dragged to reorder. It uses the useSortable hook from dnd-kit to
 * handle the drag-and-drop functionality. It renders a LocationCard inside a button,
 * and the entire card is draggable. The onDelete function is passed down to the
 * LocationCard, and we stop the click event from propagating when the delete icon
 * is clicked to prevent selecting the card when trying to delete.
 */
import { useEffect, useRef } from "react";
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
  const wasDraggedRef = useRef(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: loc.id,
  });

  // If the item was dragged, we set a ref to ignore the next click event (which would select the card after dragging)
  useEffect(() => {
    if (isDragging) {
      wasDraggedRef.current = true;
    }
  }, [isDragging]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  // When the delete button is clicked, we stop the click event from propagating to prevent selecting the card when trying to delete
  const handleSelect = () => {
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      return;
    }
    onSelectLocation(loc);
  };

  return (
    <li ref={setNodeRef} style={style} className="nav-item mb-2">
      <button
        type="button"
        className="p-0 m-0 w-100 text-left border-0 rounded bg-transparent"
        onClick={handleSelect}
        {...attributes}
        {...listeners}
        style={{ cursor: "grab" }}
      >
        <LocationCard
          {...loc}
          selected={selected}
          tempUnit={tempUnit}
          clockTick={clockTick}
          onDelete={() => onDeleteLocation(loc)}
        />
      </button>
    </li>
  );
}

export default SortableLocationItem;
