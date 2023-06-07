import { FC, useId, useState, useEffect } from 'react'
import {  useWatch } from 'react-hook-form'
import { useGridify } from '@mue-js/react'
import { Eye, EyeClosed } from '@mue-js/icons'

import { Input } from '../../../types'

interface Form {
    rules,
    formState: { errors },
    control = () => null,
    register,
}

export interface InputTextProps extends Input {
    validIfNoErrors?: boolean
    helper?: string
    maxCharacters?: number
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
    rules,
    formState: { errors },
    control = () => null,
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
                validIfNoErrors && !error && rules && rules !== {} && 'valid',
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
                    {...register(name, rules)}
                />

                {_type === 'password' &&
                    (type === 'password' ? (
                        <button type="button"
                            onClick={() => setType('text')}>

                        <EyeClosed
                            className="input-icon absolute pointer"
                            />
                            </button>
                    ) : (
                        <button type="button"
                            onClick={() => setType('password')}>
                            <Eye
                                className="input-icon absolute pointer"
                                />
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
