import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "7amdi personal site preview";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e0d0b",
          color: "#c9bfad",
          padding: "56px",
          fontFamily: "ui-monospace, Menlo, Monaco, Consolas, monospace"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            color: "#8fa67a",
            fontSize: 30
          }}
        >
          <span>{"<"}</span>
          <span>7amdi.dev</span>
          <span>{"/>"}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ color: "#c97a3a", fontSize: 78, lineHeight: 1.05 }}>7amdi</div>
          <div style={{ fontSize: 34, color: "#c9bfad" }}>
            web projects, guestbook, and silly internet vibes
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#7a6f60",
            fontSize: 24
          }}
        >
          <span>@74mdi</span>
          <span>morocco</span>
        </div>
      </div>
    ),
    size
  );
}
