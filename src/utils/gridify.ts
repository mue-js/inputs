import memoize from 'lodash.memoize'
import type { ResponsiveOrValue } from './../types'

export interface GetCSSVarForDimensionProps {
    dimension: ResponsiveOrValue
    size: string
    defaultValue: string | number
    getPrefix?: (dim: string | number) => false | string
}

export const getCSSVarForDimension = memoize(
    ({
        dimension,
        size,
        defaultValue,
        getPrefix = () => '',
    }: GetCSSVarForDimensionProps) => {
        if (dimension instanceof Object) {
            const dimensionForSize = dimension?.[size]
            if (dimensionForSize && dimensionForSize !== defaultValue) {
                const prefix = getPrefix(dimensionForSize)
                return prefix ? `${prefix}${dimensionForSize}` : dimensionForSize
            }
        } else if (
            ['string', 'number'].includes(typeof dimension) &&
            size === 'xs' &&
            dimension !== defaultValue
        ) {
            const prefix = getPrefix(dimension)
            return prefix ? `${prefix}${dimension}` : dimension
        }
    },
    ({ dimension, size, defaultValue }) =>
        `getCSSVarForDimension#${JSON.stringify(dimension)}#${size}#${defaultValue}`,
)
