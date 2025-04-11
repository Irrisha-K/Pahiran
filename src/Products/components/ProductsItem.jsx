import Card from "../../shared/components/UIElements/Card";

import "./ProductsItem.css";

export default function ProductsItem(props) {
  //   const [showMap, setShowMap] = useState(false);
  //   const [showConfirmModal, setShowConfirmModal] = useState(false);

  //   function openMapHandler() {
  //     console.log("OPENING");
  //     setShowMap(true);
  //   }

  //   function closeMapHandler() {
  //     setShowMap(false);
  //   }

  //   function showDeleteWarningHandler() {
  //     setShowConfirmModal(true);
  //   }

  //   function cancelDeleteWarningHandler() {
  //     setShowConfirmModal(false);
  //   }

  //   function confirmDeleteHandler() {
  //     setShowConfirmModal(false);
  //     console.log("DEEE");
  //   }

  return (
    <>
      {/* <Modal
        key={showMap}
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <h2>THE MAP!</h2>
        </div>
      </Modal> */}
      {/* <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteWarningHandler}
        header="Are you sure?"
        // footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteWarningHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p className="modal__text animated-text">
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter!
        </p>
      </Modal> */}
      {/* <li className="product-item">
        <Card className="product-item__content">
          <div className="product-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="product-item__info">
            <h2>{props.name}</h2>
            <h3>{props.price}</h3>
            <p>{props.description}</p>
          </div>
          <div className="product-item__actions">
            <div className="product-item__actions">
              <button className="btn--view">VIEW</button>
              <button className="btn--edit">EDIT</button>
              <button className="btn--delete">DELETE</button>
            </div>
          </div>
        </Card>
      </li> */}
      <li className="product-item">
        <Card className="product-item__content">
          <div className="product-item__image">
            <img src={props.image} alt={props.name} />
          </div>
          <div className="product-item__info">
            <h2 className="product-item__title">
              {props.name} <br />
              <span className="product-item__price">{props.price}</span>
            </h2>
          </div>
          <div className="product-item__actions">
            <button className="btn--view">VIEW</button>
            <button className="btn--edit">EDIT</button>
            <button className="btn--delete">DELETE</button>
          </div>
        </Card>
      </li>
    </>
  );
}
