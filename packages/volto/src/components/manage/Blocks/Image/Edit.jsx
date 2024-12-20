/**
 * Edit image block.
 * @module components/manage/Blocks/Image/Edit
 */

import React from 'react';
import cx from 'classnames';
import ImageSidebar from '@plone/volto/components/manage/Blocks/Image/ImageSidebar';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';

import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers/Url/Url';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import config from '@plone/volto/registry';

import { ImageInput } from '@plone/volto/components/manage/Widgets/ImageWidget';

function Edit(props) {
  const { data } = props;
  const Image = config.getComponent({ name: 'Image' }).component;

  const handleChange = React.useCallback(
    async (id, image, { title, image_field, image_scales } = {}) => {
      const url = image ? image['@id'] || image : '';

      props.onChangeBlock(props.block, {
        ...props.data,
        url: flattenToAppURL(url),
        image_field,
        image_scales,
        alt: props.data.alt || title || '',
      });
    },
    [props],
  );

  return (
    <>
      <div
        className={cx(
          'block image align',
          {
            center: !Boolean(data.align),
          },
          data.align,
        )}
      >
        {data.url ? (
          <Image
            className={cx({
              'full-width': data.align === 'full',
              large: data.size === 'l',
              medium: data.size === 'm',
              small: data.size === 's',
            })}
            item={
              data.image_scales
                ? {
                    '@id': data.url,
                    image_field: data.image_field,
                    image_scales: data.image_scales,
                  }
                : undefined
            }
            src={
              data.image_scales
                ? undefined
                : isInternalURL(data.url)
                  ? // Backwards compat in the case that the block is storing the full server URL
                    (() => {
                      if (data.size === 'l')
                        return `${flattenToAppURL(data.url)}/@@images/image`;
                      if (data.size === 'm')
                        return `${flattenToAppURL(
                          data.url,
                        )}/@@images/image/preview`;
                      if (data.size === 's')
                        return `${flattenToAppURL(data.url)}/@@images/image/mini`;
                      return `${flattenToAppURL(data.url)}/@@images/image`;
                    })()
                  : data.url
            }
            sizes={config.blocks.blocksConfig.image.getSizes(data)}
            alt={data.alt || ''}
            loading="lazy"
            responsive={true}
          />
        ) : (
          <ImageInput
            onChange={handleChange}
            placeholderLinkInput={data.placeholder}
            block={props.block}
            id={props.block}
            objectBrowserPickerType={'image'}
          />
        )}
        <SidebarPortal selected={props.selected}>
          <ImageSidebar {...props} />
        </SidebarPortal>
      </div>
    </>
  );
}

export default withBlockExtensions(Edit);
