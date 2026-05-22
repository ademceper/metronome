type EmptyRowProps = {
  message: string;
};

export const EmptyRow = ({ message, ...props }: EmptyRowProps) => {
  return (
    <div
      className="px-4 py-3 text-center text-muted-foreground text-sm"
      {...props}
    >
      {message}
    </div>
  );
};
