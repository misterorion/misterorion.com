import React, { useState } from 'react'
import { useFormik } from 'formik'
import { button } from './modules/form.module.css'
import { container } from './modules/form.module.css'
import { error } from './modules/form.module.css'
import { errorText } from './modules/form.module.css'

import { formContainer } from './modules/form.module.css'
import { input } from './modules/form.module.css'
import { label } from './modules/form.module.css'
import { message } from './modules/form.module.css'
import { nope } from './modules/form.module.css'
import { section } from './modules/form.module.css'
import { success } from './modules/form.module.css'

// Todo: at Yup validation

const url = 'https://us-central1-mechapower.cloudfunctions.net/form-gobot-d4u4inxip72sg79t'

const ContactForm = () => {

  const [buttonVisible, setButtonVisible] = useState(true)

  const toggleButtonVisible = () => {
    setButtonVisible(!buttonVisible);
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
    isSubmitting
  } = useFormik({
    initialValues: {
      namee2d8u: '',
      emaile2d8u: '',
      messagee2d8u: '',
    },
    validate: values => {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      const errors = {};
      if (touched.namee2d8u && !values.namee2d8u) {
        errors.namee2d8u = 'Name Required'
      }
      if (touched.emaile2d8u && !values.emaile2d8u) {
        errors.emaile2d8u = 'Email Required'
      } else if (!emailRegex.test(values.emaile2d8u)) {
        errors.emaile2d8u = 'Valid Email Required'
      }
      if (touched.messagee2d8u && !values.messagee2d8u) {
        errors.messagee2d8u = 'Message Required'
      }
      if (touched.namee2d8u && values.namee2d8u.length > 100) {
        errors.namee2d8u = "Name must be less than 100 characters"
      }
      if (touched.emaile2d8u && values.emaile2d8u.length > 100) {
        errors.emaile2d8u = "Email must be less than 100 characters"
      }
      if (touched.messagee2d8u && values.messagee2d8u.length > 500) {
        errors.messagee2d8u = 'Message must be less than 500 characters'
      }
      // Honeypot trap
      if ((values.name) || (values.email) || (values.message)) {
        errors.message = 'Begone with you!'
      }
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      var convertedValues = {
        name: values.namee2d8u,
        email: values.emaile2d8u,
        message: values.messagee2d8u
      }
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(convertedValues)
      })
        .then(() => {
          resetForm()
          toggleButtonVisible()
        })
        .catch(() => {
          alert('Error');
        })
    },
  })

  return (
    <div className={formContainer}>
      <h2>Contact Form</h2>
      <p>
        Form submissions go directly to my email inbox. Besides reading your
        comment, I don't do anything with your information.
      </p>
      <div className={container}>
        <form onSubmit={handleSubmit}>

          <div className={section}>
            <label htmlFor="namee2d8u" className={label}>Name</label>
            <input
              id="namee2d8u"
              name="namee2d8u"
              type="text"
              placeholder="Donald Duck"
              autocomplete="off"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.namee2d8u}
              className={input}
            />
            <div className={error}>
              {errors.namee2d8u && touched.namee2d8u && (
                <div className={errorText}>
                  {errors.namee2d8u}
                </div>
              )}
            </div>
          </div>

          <div className={section}>
            <label htmlFor="emaile2d8u" className={label}>Email</label>
            <input
              id="emaile2d8u"
              name="emaile2d8u"
              type="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.emaile2d8u}
              className={input}
              placeholder="d.duck@disney.com"
              autocomplete="off"
            />
            <div className={error}>
              {errors.emaile2d8u && touched.emaile2d8u && (
                <div className={errorText}>
                  {errors.emaile2d8u}
                </div>
              )}
            </div>
          </div>

          <div className={section}>
            <label htmlFor="messagee2d8u" className={label}>Message</label>
            <textarea
              id="messagee2d8u"
              name="messagee2d8u"
              type="textarea"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.messagee2d8u}
              className={message}
              placeholder="Maximum 500 characters"
              autocomplete="off"
            />
            <div className={error}>
              {errors.messagee2d8u && touched.messagee2d8u && (
                <div className={errorText}>
                  {errors.messagee2d8u}
                </div>
              )}
            </div>
          </div>

          {/* H o n e y p o t BEGINS */}
          <div>
            <label
              className={nope}
              htmlFor="text">name</label>
            <input
              className={nope}
              onChange={handleChange}
              autocomplete="off"
              type="text"
              id="name"
              name="name"
              placeholder="Your name here" />
            <label
              className={nope}
              htmlFor="text">email</label>
            <input
              className={nope}
              onChange={handleChange}
              autocomplete="off"
              type="email"
              id="email"
              name="email"
              placeholder="Your email here" />
            <label
              className={nope}
              htmlFor="message">message
            </label>
            <input
              className={nope}
              onChange={handleChange}
              autocomplete="off"
              type="text"
              id="message"
              name="message"
              placeholder="Your message here" />
            {errors.message}
          </div>
          {/* H o n e y p o t ENDS */}

          {buttonVisible ?
            <button
              type="submit"
              id="btnSubmit"
              value="Submit"
              className={button}
              disabled={isSubmitting}>
              Submit
            </button> :
            <div className={success}>
              Thanks for your submission!
            </div>}
        </form>
      </div>
    </div>
  )
}

export default ContactForm