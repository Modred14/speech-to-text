export default function Waveform() {
  return (
    <div className="waveform">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="wave-bar" />
      ))}
    </div>
  );
}
