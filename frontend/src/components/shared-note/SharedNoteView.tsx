"use client";

import type { SharedNotePayload } from "@/lib/types";
import { SignalDiscoveryExperience } from "../discovery/SignalDiscoveryExperience";

interface Props {
  note: SharedNotePayload;
}

export function SharedNoteView({ note }: Props) {
  return <SignalDiscoveryExperience note={note} />;
}
