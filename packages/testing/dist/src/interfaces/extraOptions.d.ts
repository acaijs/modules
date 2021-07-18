export default interface ExtraOptionsInterface {
    /**
     * ### Tagging
     *
     * Add a tag or group of tags into a single test
     */
    tag: (tags: string | string[]) => ExtraOptionsInterface;
    /**
     * ### Timeout
     *
     * Change your test default time out
     */
    timeout: (time: number) => ExtraOptionsInterface;
}
