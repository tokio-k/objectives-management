import type { ReactNode, VFC } from "react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "src/components/Button";
import { formItemInfoList } from "src/pages/root/utils";
import { useRequireLogin } from "src/utils/hooks/useRequireLogin";

type Props = {
  loading: boolean;
  submitFunction: (data: ObjectiveFormType) => void;
  initValue?: ObjectiveFormType;
  initItemLength?: [number, number, number, number, number];
  isEdit?: boolean;
  editCloseButton?: ReactNode;
};

export type ObjectiveFormType = {
  title: string;
  objectiveItems: { id: string; title: string; itemsType: number }[];
};

export const ObjectiveForm: VFC<Props> = ({
  loading,
  submitFunction,
  initValue,
  initItemLength = [0, 0, 0, 0, 0],
  isEdit,
  editCloseButton,
}) => {
  const { control, register, handleSubmit, formState, reset, setValue } =
    useForm<ObjectiveFormType>({
      defaultValues: initValue,
    });
  const { fields, insert, remove } = useFieldArray({
    control,
    name: "objectiveItems",
  });
  const [length, setLength] = useState(initItemLength);
  const handleAddForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    const itemsType = parseInt(e.currentTarget.value);
    const index = length.slice(0, itemsType).reduce((prev, current) => {
      return prev + current;
    });
    insert(index, { title: "", itemsType });
    length[itemsType - 1] += 1;
    setLength(length);
  };
  const handleRemoveForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    const [index, items_type] = e.currentTarget.value.split(",");
    length[parseInt(items_type) - 1] -= 1;
    setLength(length);
    remove(parseInt(index));
  };

  const requireLogin = useRequireLogin();

  const handleClick = handleSubmit(async (data) => {
    if (requireLogin()) {
      return;
    }
    try {
      await submitFunction(data);
      reset({ title: "", objectiveItems: [] });
      toast.success(`目標を${isEdit ? "更新" : "追加"}しました`);
    } catch (error) {
      toast.error("エラーが発生しました");
    }
  });

  return (
    <div>
      <fieldset>
        <input
          {...register("title", {
            required: { value: true, message: "入力必須です" },
            minLength: { value: 2, message: "2文字以上で入力してください" },
            maxLength: {
              value: 1000,
              message: "1000文字以下で入力してください",
            },
          })}
          className="bg-transparent border-b border-themeGray-3 p-2 w-full focus:outline-none"
          placeholder="目標はなに？"
        />
        {formState.errors.title ? (
          <p className="text-red-500 text-xs ml-2">
            ※ {formState.errors.title?.message}
          </p>
        ) : null}
        {fields.map((field, index) => {
          setValue(`objectiveItems.${index}.id`, field?.id);
          return (
            <div key={index}>
              <label className="flex items-center">
                <span className="text-xs">
                  {" "}
                  - {formItemInfoList[field.itemsType].title} -
                </span>
                <input
                  {...register(`objectiveItems.${index}.title`)}
                  className="bg-transparent border-b border-themeGray-3 p-2 flex-auto focus:outline-none"
                  placeholder={formItemInfoList[field.itemsType].placeholder}
                />
                <button
                  onClick={handleRemoveForm}
                  value={`${index},${field.itemsType}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mx-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </label>
            </div>
          );
        })}
      </fieldset>
      <div className="flex justify-between py-2">
        <div className="text-themeGray-2 space-x-4">
          <button onClick={handleAddForm} value="1">
            + 期間
          </button>
          <button onClick={handleAddForm} value="2">
            + 程度
          </button>
          <button onClick={handleAddForm} value="3">
            + 目的
          </button>
          <button onClick={handleAddForm} value="4">
            + 行動
          </button>
          <button onClick={handleAddForm} value="5">
            + 評価指標
          </button>
        </div>
        <div className="flex space-x-4 content-center">
          {isEdit && editCloseButton}
          <Button
            onClick={handleClick}
            className="w-20"
            disabled={loading}
            variant="solid-green"
          >
            {isEdit
              ? loading
                ? "更新中"
                : "更新"
              : loading
              ? "保存中"
              : "保存"}
          </Button>
        </div>
      </div>
    </div>
  );
};
