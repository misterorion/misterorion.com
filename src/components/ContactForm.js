import React, { useState } from 'react'
import { useFormik } from 'formik'
import { button } from './modules/form.module.css'
import { container } from './modules/form.module.css'
import { error } from './modules/form.module.css'
import { errorText } from './modules/form.module.css'
import { formContainer } from './modules/form.module.css'
import { formOpaque } from './modules/form.module.css'
import { input } from './modules/form.module.css'
import { label } from './modules/form.module.css'
import { comment } from './modules/form.module.css'
import { nope } from './modules/form.module.css'
import { section } from './modules/form.module.css'
import { success } from './modules/form.module.css'

const formEndpoint = `${process.env.GATSBY_FORM_ENDPOINT}`

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
      commente2d8u: '',
    },
    validate: values => {
      const nameRegex = /^(?![\s.]+$)[a-zA-Z\s'.]*$/; // Negative lookahead for all spaces or "."
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      const commentRegex = /^[^:$#@^&*]*$/; // not :$#@^&*
      const errors = {};
      if (touched.namee2d8u && !values.namee2d8u) {
        errors.namee2d8u = 'Name Required'
      } else if (!nameRegex.test(values.namee2d8u)) {
        errors.namee2d8u = 'Valid Name required (no special characters)'
      }
      if (touched.emaile2d8u && !values.emaile2d8u) {
        errors.emaile2d8u = 'Email Required'
      } else if (!emailRegex.test(values.emaile2d8u)) {
        errors.emaile2d8u = 'Valid Email Required'
      }
      if (touched.commente2d8u && !values.commente2d8u) {
        errors.commente2d8u = 'Comment Required'
      } else if (!commentRegex.test(values.commente2d8u)) {
        errors.commente2d8u = "Valid comment required (:$#@^&* not allowed)"
      }
      if (touched.namee2d8u && values.namee2d8u.length > 100) {
        errors.namee2d8u = "Name must be less than 100 characters"
      }
      if (touched.emaile2d8u && values.emaile2d8u.length > 100) {
        errors.emaile2d8u = "Email must be less than 100 characters"
      }
      if (touched.commente2d8u && values.commente2d8u.length > 500) {
        errors.commente2d8u = 'Comment must be less than 500 characters'
      }
      // Honeypot trap
      if ((values.name) || (values.email) || (values.comment)) {
        errors.message = 'Begone with you!'
      }
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      var convertedValues = {
        name: values.namee2d8u,
        email: values.emaile2d8u,
        comment: values.commente2d8u
      }
      await fetch(formEndpoint, {
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
        Form submissions are sent to my email inbox. Besides reading your
        comment, I don't do anything with your information. Caveat: I log IPs
        to prevent spam.
      </p>
      <p><strong>Enter a valid email if you want a response.</strong></p>
      <div className={container}>
        <form onSubmit={handleSubmit} className={isSubmitting ? formOpaque : "" }>
          <div className={section}>
            <label htmlFor="namee2d8u" className={label}>Name</label>
            <input
              autocomplete="off"
              className={input}
              id="namee2d8u"
              name="namee2d8u"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="Donald Duck"
              type="text"
              value={values.namee2d8u}
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
              autocomplete="off"
              className={input}
              id="emaile2d8u"
              name="emaile2d8u"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="d.duck@disney.com"
              type="email"
              value={values.emaile2d8u}
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
            <label htmlFor="commente2d8u" className={label}>Comment</label>
            <textarea
              autocomplete="off"
              className={comment}
              id="commente2d8u"
              name="commente2d8u"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="Maximum 500 characters"
              type="textarea"
              value={values.commente2d8u}
            />
            <div className={error}>
              {errors.commente2d8u && touched.commente2d8u && (
                <div className={errorText}>
                  {errors.commente2d8u}
                </div>
              )}
            </div>
          </div>

          {/* H o n e y p o t BEGINS */}
          <div>
            <label
              className={nope}
              htmlFor="text">
              Name
            </label>
            <input
              className={nope}
              onChange={handleChange}
              autocomplete="off"
              type="text"
              id="name"
              name="name"
              placeholder="Your name here"
              tabindex="-1"
            />
            <label
              className={nope}
              htmlFor="text">
              Email
            </label>
            <input
              className={nope}
              onChange={handleChange}
              autocomplete="off"
              type="email"
              id="email"
              name="email"
              placeholder="Your email here"
              tabindex="-1"
            />
            <label
              className={nope}
              htmlFor="message">
              Message
            </label>
            <input
              className={nope}
              onChange={handleChange}
              autocomplete="off"
              type="text"
              id="message"
              name="message"
              placeholder="Your message here"
              tabindex="-1"
            />
            {errors.message}
          </div>
          {/* H o n e y p o t ENDS */}

          {buttonVisible ?
            <button
              className={button}
              disabled={isSubmitting}
              id="btnSubmit"
              type="submit"
              value="Submit"
            >
              Submit
            </button> :
            <div className={success}>
              Thanks for your comment!
            </div>}
        </form>
      </div>
    </div>
  )
}

export default ContactForm