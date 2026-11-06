"use client";

import { useState } from "react";
import { Icon } from "../shared/Icon";
import { Modal } from "../shared/Modal";
import { RequestFlow } from "../shared/RequestFlow";
import { JAPANESE_FLOW } from "./flow-config";

type Props = {
  label: string;
  course: { title: string; duration: string; prices: ReadonlyArray<string> };
};

/** 「この内容で相談する」: opens the consultation request flow in a dialog. */
export function ConsultButton({ label, course }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn btn-primary" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <span>{label}</span>
        <Icon name="arrow" />
      </button>
      {open ? (
        <Modal booking title={JAPANESE_FLOW.heading.replace("{course title}", course.title)} onClose={() => setOpen(false)}>
          <RequestFlow
            hideHeading
            labels={JAPANESE_FLOW}
            course={{ name: course.title, price: course.prices.join(", "), duration: course.duration }}
          />
        </Modal>
      ) : null}
    </>
  );
}
