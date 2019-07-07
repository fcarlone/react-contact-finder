import React, { Fragment, useContext } from "react";
import ContactItem from "./ContactItem";
import ConactContext from "../../context/contact/contactContext";

const Contacts = () => {
  const contactContext = useContext(ConactContext);

  const { contacts } = contactContext;

  return (
    <Fragment>
      {contacts.map(contact => (
        <ContactItem key={contact.id} contact={contact} />
      ))}
    </Fragment>
  );
};

export default Contacts;
