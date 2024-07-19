import { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import { supabase } from '@/client';

function cleanInput(value) {
    return `${value}`.replace(/[<>%$]/gi, "");
}

function ContactForm() {
    const defaultContact = {
        name: "",
        email: "",
        body: "",
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [feeback, setFeedback] = useState("");

    const ContactSchema = Yup.object().shape({
        name: Yup.string().max(140, "Too long!").required("Required."),
        email: Yup.string().email("Invalid email.").max(140, "Too long!").required("Required."),
        body: Yup.string().max(280, "Too long!").required("Required."),
    });

    async function handleSubmit(values, { resetForm }) {
        setIsSubmitting(true);
        const { name, email, body } = values;
        try {
            const { error } = await supabase.from("contacts").insert({ name, email, body });
            if (error) {
                throw error;
            }
            setFeedback("Form submitted successfully");
            setIsSuccessful(true);
            resetForm();
        } catch (error) {
            console.log("Error occurred", { error });
            setFeedback("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        if (feeback && !isSuccessful) {
            setTimeout(() => setFeedback(""), 3000);
        }
    }, [feeback, isSuccessful]);

    return (
        <section className="form-container">
            <h2>Contact form</h2>
            {feeback && (
                <div className="feedback rounded-md">
                    <p className="font-extrabold text-1xl">{feeback}</p>
                </div>
            )}
            {!isSuccessful && (
                <Formik
                    enableReinitialize
                    initialValues={defaultContact}
                    validationSchema={ContactSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue }) => (
                        <Form>
                            <div className="my-6 p-5 bg-[#eff6ff] font-[sans-serif] rounded-md ">
                                <h1 className="text-3xl text-[#333] font-extrabold text-center">Contact</h1>
                                <Field name="name">
                                    {({ field, meta }) => (
                                        <div className="form-control">
                                            <input {...field} placeholder='Name' id="contact-name"
                                                className="w-full  mt-3 rounded-md py-3 bg-white text-sm outline-blue-500"
                                                onChange={(e) => {
                                                    const value = cleanInput(e.target.value);
                                                    setFieldValue("name", value);
                                                }} />
                                            {meta.error && meta.touched && <p>{meta.error}</p>}
                                        </div>
                                    )}
                                </Field>
                                <Field name="email">
                                    {({ field, meta }) => (
                                        <div className="form-control">
                                            <input {...field} placeholder='Email' id="contact-email"
                                                className="w-full  mt-3 rounded-md py-3 bg-white text-sm outline-blue-500"
                                                onChange={(e) => {
                                                    const value = cleanInput(e.target.value);
                                                    setFieldValue("email", value);
                                                }} />
                                            {meta.error && meta.touched && <p>{meta.error}</p>}
                                        </div>
                                    )}
                                </Field>
                                <Field name="body">
                                    {({ field, meta }) => (
                                        <div className="form-control">
                                            <textarea {...field} id="contact-body" placeholder='Message' rows="6"
                                                className="w-full mt-3 rounded-md bg-white text-sm pt-3 outline-blue-500"
                                                onChange={(e) => {
                                                    const value = cleanInput(e.target.value);
                                                    setFieldValue("body", value);
                                                }} />
                                            {meta.error && meta.touched && <p>{meta.error}</p>}
                                        </div>
                                    )}
                                </Field>
                                <div className="button-container  m-3">
                                    <button type='submit'
                                        className="text-white bg-[#059669] font-semibold rounded-md text-sm py-3 w-full">{isSubmitting ? "Submitting..." : "Submit"}</button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>

            )}
        </section>
    );
}

export default ContactForm;
