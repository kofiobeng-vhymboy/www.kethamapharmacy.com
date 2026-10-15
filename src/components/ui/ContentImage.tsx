import React, { useState } from 'react';

// Keep layout and a useful explanation when an external supplier image fails.
export default function ContentImage({ src, alt = '', loading = 'lazy', onError, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [failedSource, setFailedSource] = useState<string>();
  const failed = failedSource === src;
  return <img {...props} src={failed ? '/image-unavailable.svg' : src}
    alt={failed && alt ? `${alt} — image unavailable` : alt} loading={loading}
    decoding="async" onError={event => { if (!failed) setFailedSource(src); onError?.(event); }} />;
}
