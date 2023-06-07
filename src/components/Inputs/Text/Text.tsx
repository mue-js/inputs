import { Eye, EyeClosed } from '@mue-js/icons'
import { FC, useEffect, useId, useState } from 'react'
import { RegisterOptions, UseFormReturn, useWatch } from 'react-hook-form'

import { Input } from '../../../types'
import { useGridify } from '@mue-js/react/'

export interface InputTextProps extends Input, UseFormReturn {
    validIfNoErrors?: boolean
    helper?: string
    maxCharacters?: number
    options: RegisterOptions
}

const InputText: FC<InputTextProps> = ({
    // input
    label,
    name,
    type: _type = 'text',
    defaultValue = '',
    placeholder,
    disabled,
    readOnly = disabled,
    className = '',
    inputClassName = '',
    // other
    validIfNoErrors,
    helper,
    maxCharacters,
    // form
    options,
    formState: { errors },
    control,
    register,
    // grid props
    ...props
}) => {
    const {
        className: gridClassName,
        style: gridStyle = {},
        ...gridProps
    } = useGridify({
        componentName: 'InputText',
        ...props,
    })

    const id = useId()
    const [type, setType] = useState(_type)

    const error = errors?.[name]?.message
    const value = useWatch({
        control,
        name,
        defaultValue,
    })

    useEffect(() => {
        if (_type) {
            setType(_type)
        }
    }, [_type])

    return (
        <label
            className={[
                'field',
                gridClassName,
                className,
                !value && 'empty',
                error && 'invalid',
                validIfNoErrors && !error && 'valid',
                (disabled || readOnly) && 'disabled',
            ]
                .filter(e => e)
                .join(' ')}
            style={gridStyle}
            {...gridProps}
        >
            <label className="label bold mb-4" htmlFor={id}>
                {label || name}
            </label>
            <div className="relative flex align-items-center width-100%">
                <input
                    className={['input flex-1', _type === 'password' && 'with-icon', inputClassName]
                        .filter(e => e)
                        .join(' ')}
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    readOnly={readOnly}
                    disabled={disabled}
                    {...register(name, options)}
                />

                {_type === 'password' &&
                    (type === 'password' ? (
                        <button type="button" onClick={() => setType('text')}>
                            <EyeClosed className="input-icon absolute pointer" />
                        </button>
                    ) : (
                        <button type="button" onClick={() => setType('password')}>
                            <Eye className="input-icon absolute pointer" />
                        </button>
                    ))}
            </div>

            <div className="flex justify-space-between">
                <div className="helper flex-1">{error ? error?.message ?? 'Erreur' : helper}</div>

                {maxCharacters && (
                    <div className="helper ml-40">
                        {value?.length || 0}/{maxCharacters}
                    </div>
                )}
            </div>
        </label>
    )
}

export default InputText
