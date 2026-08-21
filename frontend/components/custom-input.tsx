// Reusable input wrapper that standardizes field rendering for the custom forms.
interface Properties {
  placeholder: string;
  type: string;
  name: string;
}

export default function CustomInput({ placeholder, type, name }: Properties) {
  return (
    <input
      className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
      placeholder={placeholder}
      type={type}
      name={name}
    />
  );
}
