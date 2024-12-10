import { useFormik } from "formik";
import React, { useEffect } from "react";
import { Form, FormGroup } from "react-bootstrap";
import LoadingButton from "src/modules/common/components/LoadingButton";
import { useAppDispatch } from "src/store";
import {
  setR as storeSetR,
  setX as storeSetX,
  setY as storeSetY,
} from "src/store/dashboard.reducer";
import * as Yup from "yup";
import "./Dashboard.css";

const DashboardForm: React.FC<{
  onHitSubmit: (x: number, y: number, r: number) => void;
  isLoading: boolean;
}> = ({ onHitSubmit, isLoading }) => {
  const dispatch = useAppDispatch();

  // Initialize Formik with validation schema
  const formik = useFormik({
    initialValues: {
      x: "",
      y: "",
      r: "",
    },
    validationSchema: Yup.object({
      x: Yup.number()
        .required("X is required")
        .min(-5, "X must be at least -5")
        .max(3, "X must be at most 3"),
      y: Yup.string()
        .test(
          "is-number",
          "Y must be a number",
          (value) => !isNaN(Number(value)),
        )
        .test("in-range", "Y must be between -3 and 3", (value) => {
          const num = Number(value);
          return num >= -3 && num <= 3;
        }),
      r: Yup.number()
        .required("R is required")
        .min(-5, "R must be at least -5")
        .max(3, "R must be at most 3"),
    }),
    onSubmit: (values) => {
      // Dispatch updates to the store on form submit
      dispatch(storeSetX(+values.x));
      dispatch(storeSetY(+values.y));
      dispatch(storeSetR(+values.r));

      onHitSubmit(+values.x, +values.y, +values.r);

      dispatch(storeSetX(null));
      dispatch(storeSetY(null));
      formik.resetForm({
        values: {
          x: "",
          y: "",
          r: values.r,
        },
      });
    },
    validateOnBlur: true,
  });

  useEffect(() => {
    const r = formik.values.r;
    if (!formik.isValidating && r !== "" && !formik.errors.r) {
      dispatch(storeSetR(+r));
    }
  }, [formik.values.r, formik.errors.r, dispatch, formik.isValidating]);

  return (
    <Form className="p-1 outlined" onSubmit={formik.handleSubmit}>
      <FormGroup>
        <Form.Label>X</Form.Label>
        <Form.Control
          step="any"
          min={-5}
          max={3}
          onBlur={formik.handleBlur}
          type="number"
          name="x"
          value={formik.values.x}
          onChange={formik.handleChange}
          isInvalid={!!formik.errors.x && formik.touched.x}
          isValid={!formik.errors.x && formik.touched.x}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.x}
        </Form.Control.Feedback>
      </FormGroup>
      <FormGroup>
        <Form.Label>Y</Form.Label>
        <Form.Control
          onBlur={formik.handleBlur}
          type="text"
          name="y"
          value={formik.values.y}
          onChange={formik.handleChange}
          isInvalid={!!formik.errors.y && formik.touched.y}
          isValid={!formik.errors.y && formik.touched.y}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.y}
        </Form.Control.Feedback>
      </FormGroup>
      <FormGroup>
        <Form.Label>R</Form.Label>
        <Form.Control
          step={0.5}
          min={-5}
          max={3}
          onBlur={formik.handleBlur}
          type="number"
          name="r"
          value={formik.values.r}
          onChange={formik.handleChange}
          isInvalid={!!formik.errors.r && formik.touched.r}
          isValid={!formik.errors.r && formik.touched.r}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.r}
        </Form.Control.Feedback>
      </FormGroup>
      <hr />
      <LoadingButton
        className="mt-3"
        type="submit"
        variant="primary"
        disabled={!formik.dirty || !formik.isValid || isLoading}
        isLoading={isLoading}
      >
        Проверить
      </LoadingButton>
    </Form>
  );
};

export default DashboardForm;
