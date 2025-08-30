export default function LoadingButton({ text }) {
    return (
         <div className="btn btn-outline btn-primary w-full rounded-xl">
            <span className="loading loading-spinner loading-md mr-3" />
            {text}
         </div>
    );
}